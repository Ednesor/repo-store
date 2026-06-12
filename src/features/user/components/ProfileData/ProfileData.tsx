import { useState } from 'react';
import { useAuthStore } from '../../../../store/useAuthStore';
import { useProfile } from '../../hooks/useProfile';

export default function ProfileData() {
    const { user } = useAuthStore();
    const { updateProfile, isUpdating } = useProfile();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        nombre: user?.nombre || '',
        apellido: user?.apellido || '',
        celular: user?.celular || ''
    });

    if (!user) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateProfile(formData);
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile", error);
            alert("Hubo un error al actualizar el perfil.");
        }
    };

    return (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-headline-md font-bold text-on-surface">Información Personal</h2>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-primary font-bold hover:underline"
                    >
                        Actualizar Info
                    </button>
                )}
            </div>

            {isEditing ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-[400px] max-w-full">
                    <div className="flex flex-col">
                        <label className="text-label-md text-on-surface-variant block mb-1">Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                            className="w-full border border-outline rounded-md p-2 bg-surface text-on-surface focus:outline-none focus:border-primary"
                            style={{ minWidth: '100%' }}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-label-md text-on-surface-variant block mb-1">Apellido</label>
                        <input
                            type="text"
                            name="apellido"
                            value={formData.apellido}
                            onChange={handleChange}
                            className="w-full border border-outline rounded-md p-2 bg-surface text-on-surface focus:outline-none focus:border-primary"
                            style={{ minWidth: '100%' }}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-label-md text-on-surface-variant block mb-1">Celular</label>
                        <input
                            type="text"
                            name="celular"
                            value={formData.celular}
                            onChange={handleChange}
                            className="w-full border border-outline rounded-md p-2 bg-surface text-on-surface focus:outline-none focus:border-primary"
                            style={{ minWidth: '100%' }}
                        />
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="text-on-surface-variant font-bold hover:underline"
                            disabled={isUpdating}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="bg-primary text-on-primary px-4 py-2 rounded-md font-bold disabled:opacity-50"
                        >
                            {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-label-md text-on-surface-variant uppercase tracking-wider">Nombre</label>
                            <p className="text-body-lg text-on-surface font-medium mt-1">{user.nombre}</p>
                        </div>
                        <div>
                            <label className="text-label-md text-on-surface-variant uppercase tracking-wider">Apellido</label>
                            <p className="text-body-lg text-on-surface font-medium mt-1">{user.apellido || '-'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-label-md text-on-surface-variant uppercase tracking-wider">Email</label>
                            <p className="text-body-lg text-on-surface font-medium mt-1">{user.email}</p>
                        </div>
                        <div>
                            <label className="text-label-md text-on-surface-variant uppercase tracking-wider">Celular</label>
                            <p className="text-body-lg text-on-surface font-medium mt-1">{user.celular || '-'}</p>
                        </div>
                    </div>

                    <div>
                        <label className="text-label-md text-on-surface-variant uppercase tracking-wider">Roles</label>
                        <div className="flex gap-2 mt-2">
                            {user.roles?.map((rol, index) => (
                                <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-label-md font-bold">
                                    {rol.nombre}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
