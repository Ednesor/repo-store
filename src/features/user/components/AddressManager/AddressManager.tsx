import { useState } from 'react';
import { useDirecciones } from '../../hooks/useDirecciones';
import AddressFormModal from '../AddressFormModal/AddressFormModal';
import type { Direccion } from '../../../../shared/types/domain.types';

export default function AddressManager() {
    const { direcciones, isLoading, isError, remove, setPrincipal } = useDirecciones();

    // Estados para el Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addressToEdit, setAddressToEdit] = useState<Direccion | null>(null);
    const [addressToDelete, setAddressToDelete] = useState<number | null>(null);

    const handleAddClick = () => {
        setAddressToEdit(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (dir: Direccion) => {
        setAddressToEdit(dir);
        setIsModalOpen(true);
    };

    if (isLoading) return <div className="p-4 text-center">Cargando tus direcciones...</div>;
    if (isError) return <div className="p-4 text-center text-error font-bold">Error al cargar las direcciones.</div>;

    return (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-headline-md font-bold text-on-surface">Mis Direcciones</h2>
                <button
                    onClick={handleAddClick}
                    className="bg-primary text-on-primary px-4 py-2 rounded-md font-bold hover:bg-primary/90 transition-colors"
                >
                    + Añadir Nueva
                </button>
            </div>

            {direcciones.length === 0 ? (
                <p className="text-on-surface-variant">No tenés direcciones guardadas todavía.</p>
            ) : (
                <div className="grid gap-4">
                    {direcciones.map((dir) => (
                        <div key={dir.id} className={`p-4 border rounded-md flex justify-between items-center ${dir.es_principal ? 'border-primary bg-primary/5' : 'border-outline-variant'}`}>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-body-lg text-on-surface">{dir.alias || 'Dirección'}</span>
                                    {dir.es_principal && (
                                        <span className="text-label-sm bg-primary text-on-primary px-2 py-0.5 rounded-full font-bold">
                                            Principal
                                        </span>
                                    )}
                                </div>
                                <p className="text-body-md text-on-surface-variant mt-1">
                                    {dir.linea1} {dir.linea2 ? `, ${dir.linea2}` : ''}
                                </p>
                                <p className="text-body-md text-on-surface-variant">
                                    {dir.ciudad}, {dir.provincia} {dir.codigo_postal}
                                </p>
                            </div>

                            <div className="flex flex-col gap-2 items-end z-10">
                                {!dir.es_principal && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setPrincipal(dir.id).catch(err => console.error(err));
                                        }}
                                        className="text-label-md font-bold text-primary hover:underline cursor-pointer"
                                    >
                                        Hacer principal
                                    </button>
                                )}
                                <div className="flex gap-4 mt-2">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleEditClick(dir);
                                        }}
                                        className="text-label-md font-bold text-secondary hover:underline cursor-pointer"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setAddressToDelete(dir.id);
                                        }}
                                        className="text-label-md font-bold text-error hover:underline cursor-pointer"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de formulario */}
            {isModalOpen && (
                <AddressFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    direccionAEditar={addressToEdit}
                />
            )}

            {/* Modal de Confirmación de Borrado */}
            {addressToDelete !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 w-[400px] max-w-[95vw] shadow-lg text-center">
                        <div className="mb-4">
                            <span className="material-symbols-outlined text-error text-[48px] mb-2" data-weight="fill">
                                warning
                            </span>
                            <h3 className="text-headline-md font-bold text-on-surface mb-2">
                                ¿Eliminar dirección?
                            </h3>
                            <p className="text-body-md text-on-surface-variant">
                                Esta acción no se puede deshacer. Vas a perder esta dirección de tu cuenta.
                            </p>
                        </div>
                        <div className="flex gap-4 justify-center mt-6">
                            <button
                                type="button"
                                onClick={() => setAddressToDelete(null)}
                                className="text-on-surface-variant font-bold hover:underline px-4 py-2"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    remove(addressToDelete)
                                        .then(() => setAddressToDelete(null))
                                        .catch(err => {
                                            console.error("Error al eliminar:", err);
                                            alert("No se pudo eliminar la dirección.");
                                            setAddressToDelete(null);
                                        });
                                }}
                                className="bg-error text-on-error px-6 py-2 rounded-md font-bold hover:bg-error/90 transition-colors"
                            >
                                Sí, eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
