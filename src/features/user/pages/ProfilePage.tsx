import { useState } from 'react';
import ProfileData from '../components/ProfileData/ProfileData';
import AddressManager from '../components/AddressManager/AddressManager';

export default function ProfilePage() {
    // Nuestro estado para saber qué pestaña está activa
    const [activeTab, setActiveTab] = useState<'datos' | 'direcciones'>('datos');

    return (
        <div className="w-full max-w-4xl mx-auto py-xl">
            <h1 className="text-headline-lg font-bold text-on-surface mb-8">Mi Cuenta</h1>

            <div className="flex gap-6 border-b border-outline-variant mb-8">
                <button
                    onClick={() => setActiveTab('datos')}
                    className={`pb-3 text-label-lg font-bold transition-colors relative ${activeTab === 'datos'
                        ? 'text-primary'
                        : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                >
                    Mis Datos Personales
                    {activeTab === 'datos' && <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-primary rounded-t-md" />}
                </button>

                <button
                    onClick={() => setActiveTab('direcciones')}
                    className={`pb-3 text-label-lg font-bold transition-colors relative ${activeTab === 'direcciones'
                        ? 'text-primary'
                        : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                >
                    Mis Direcciones
                    {activeTab === 'direcciones' && <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-primary rounded-t-md" />}
                </button>
            </div>

            {activeTab === 'datos' && <ProfileData />}
            {activeTab === 'direcciones' && <AddressManager />}
        </div>
    );
}
