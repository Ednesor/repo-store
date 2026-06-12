import { useState } from 'react';
import type { DireccionCreate, Direccion } from '../../../../shared/types/domain.types';
import { useDirecciones } from '../../hooks/useDirecciones';

interface AddressFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    direccionAEditar?: Direccion | null;
}

export default function AddressFormModal({ isOpen, onClose, direccionAEditar }: AddressFormModalProps) {
    const { create, update } = useDirecciones();

    // Estado del formulario
    const [formData, setFormData] = useState<DireccionCreate>({
        alias: direccionAEditar?.alias || '',
        linea1: direccionAEditar?.linea1 || '',
        linea2: direccionAEditar?.linea2 || '',
        ciudad: direccionAEditar?.ciudad || '',
        provincia: direccionAEditar?.provincia || '',
        codigo_postal: direccionAEditar?.codigo_postal || ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (direccionAEditar) {
                await update({ id: direccionAEditar.id, data: formData });
            } else {
                await create(formData);
            }
            onClose();
        } catch (error) {
            console.error("Error al guardar dirección:", error);
            alert("Hubo un error al guardar la dirección");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-surface-container border border-outline-variant rounded-xl p-6 w-[500px] max-w-[95vw] max-h-[90vh] overflow-y-auto shadow-lg">
                <h3 className="text-headline-md font-bold text-on-surface mb-6">
                    {direccionAEditar ? 'Editar Dirección' : 'Nueva Dirección'}
                </h3>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="text-label-md font-medium text-on-surface-variant block mb-1">
                            Alias (Ej: Casa, Trabajo)
                        </label>
                        <input
                            type="text"
                            name="alias"
                            value={formData.alias || ''}
                            onChange={handleChange}
                            className="w-full border border-outline rounded-md p-2 bg-surface text-on-surface focus:outline-none focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="text-label-md font-medium text-on-surface-variant block mb-1">
                            Línea 1 (Calle y número) *
                        </label>
                        <input
                            type="text"
                            name="linea1"
                            required
                            value={formData.linea1}
                            onChange={handleChange}
                            className="w-full border border-outline rounded-md p-2 bg-surface text-on-surface focus:outline-none focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="text-label-md font-medium text-on-surface-variant block mb-1">
                            Línea 2 (Piso, depto, etc)
                        </label>
                        <input
                            type="text"
                            name="linea2"
                            value={formData.linea2 || ''}
                            onChange={handleChange}
                            className="w-full border border-outline rounded-md p-2 bg-surface text-on-surface focus:outline-none focus:border-primary"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-label-md font-medium text-on-surface-variant block mb-1">
                                Ciudad *
                            </label>
                            <input
                                type="text"
                                name="ciudad"
                                required
                                value={formData.ciudad}
                                onChange={handleChange}
                                className="w-full border border-outline rounded-md p-2 bg-surface text-on-surface focus:outline-none focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="text-label-md font-medium text-on-surface-variant block mb-1">
                                Provincia
                            </label>
                            <input
                                type="text"
                                name="provincia"
                                value={formData.provincia || ''}
                                onChange={handleChange}
                                className="w-full border border-outline rounded-md p-2 bg-surface text-on-surface focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-label-md font-medium text-on-surface-variant block mb-1">
                            Código Postal
                        </label>
                        <input
                            type="text"
                            name="codigo_postal"
                            value={formData.codigo_postal || ''}
                            onChange={handleChange}
                            className="w-full border border-outline rounded-md p-2 bg-surface text-on-surface focus:outline-none focus:border-primary"
                        />
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-on-surface-variant font-bold hover:text-on-surface px-4 py-2"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-primary text-on-primary font-bold px-6 py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
