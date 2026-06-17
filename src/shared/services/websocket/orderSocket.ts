import { useWsStore } from '../../../store/wsStore';
// Obtener base URL de forma segura
const HTTP_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export type OrderEventType =
    | "NUEVO_PEDIDO"
    | "PEDIDO_CONFIRMADO"
    | "PEDIDO_EN_PREPARACION"
    | "PEDIDO_EN_CAMINO"
    | "PEDIDO_CANCELADO"
    | "ESTADO_ACTUALIZADO";

export type OrderEventHandler<T = unknown> = (data: T) => void;

export interface OrderSocketMessage<T = unknown> {
    event: OrderEventType;
    data: T;
}

interface OrderSocketListener {
    handler: OrderEventHandler;
}

const RECONNECT_DELAY_MS = 5000;

export class OrderSocket {
    private static instance: OrderSocket | null = null;

    private socket: WebSocket | null = null;
    private listeners: Map<OrderEventType, Set<OrderSocketListener>> = new Map();
    private roomRefCount = 0;
    private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    private isManualClose = false;
    private currentPedidoId: number | null = null;

    private constructor() {}

    static getInstance(): OrderSocket {
        if (!OrderSocket.instance) {
            OrderSocket.instance = new OrderSocket();
        }
        return OrderSocket.instance;
    }

    joinRoom(pedidoId: number): void {
        this.currentPedidoId = pedidoId;
        this.roomRefCount += 1;
        if (this.roomRefCount === 1) {
            this.connect();
        }
    }

    leaveRoom(): void {
        this.roomRefCount = Math.max(0, this.roomRefCount - 1);
        if (this.roomRefCount === 0) {
            this.disconnect();
            this.currentPedidoId = null;
        }
    }

    on<T = unknown>(event: OrderEventType, handler: OrderEventHandler<T>): () => void {
        const listener: OrderSocketListener = { handler: handler as OrderEventHandler };
        let bucket = this.listeners.get(event);
        if (!bucket) {
            bucket = new Set();
            this.listeners.set(event, bucket);
        }
        bucket.add(listener);

        return () => {
            const current = this.listeners.get(event);
            if (!current) return;
            current.delete(listener);
            if (current.size === 0) {
                this.listeners.delete(event);
            }
        };
    }

    disconnect(): void {
        this.isManualClose = true;
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        useWsStore.getState().setConnected(false);
    }

    private connect(): void {
        if (
            this.socket &&
            (this.socket.readyState === WebSocket.OPEN ||
                this.socket.readyState === WebSocket.CONNECTING)
        ) {
            return;
        }
        if (!this.currentPedidoId) return;

        this.isManualClose = false;

        const wsProtocol = HTTP_URL.startsWith("https") ? "wss:" : "ws:";
        const host = HTTP_URL.replace(/^https?:\/\//, "");
        const url = `${wsProtocol}//${host}/pedidos/${this.currentPedidoId}/ws`;

        const socket = new WebSocket(url);
        this.socket = socket;

        socket.onopen = () => {
            useWsStore.getState().setConnected(true);
        };

        socket.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data) as OrderSocketMessage;
                this.dispatch(msg);
            } catch (err) {
                console.error("[OrderSocket] error parseando mensaje:", err);
            }
        };

        socket.onerror = () => {
            // El evento onclose se encarga de la reconexión.
        };

        socket.onclose = (event) => {
            useWsStore.getState().setConnected(false);
            this.socket = null;
            if (event.code === 1008) {
                console.error("[OrderSocket] conexion rechazada por el backend (1008)");
                return;
            }
            if (!this.isManualClose && this.roomRefCount > 0) {
                this.reconnectTimer = setTimeout(() => this.connect(), RECONNECT_DELAY_MS);
            }
        };
    }

    private dispatch(msg: OrderSocketMessage): void {
        const bucket = this.listeners.get(msg.event);
        if (!bucket) return;
        for (const listener of bucket) {
            try {
                listener.handler(msg.data);
            } catch (err) {
                console.error(`[OrderSocket] error en listener de ${msg.event}:`, err);
            }
        }
    }
}
