import { AppDataSource } from '../../config/database';
import { ConfiguracionGlobal } from '../../entities/ConfiguracionGlobal';

const configuracionRepo = AppDataSource.getRepository(ConfiguracionGlobal);

export const ConfiguracionService = {
  /**
   * Obtiene la configuración actual. Si no existe, la crea con valores por defecto.
   */
  async obtenerConfiguracion(): Promise<ConfiguracionGlobal> {
    const config = await configuracionRepo.find();
    
    if (config.length > 0) {
      return config[0];
    }
    
    // Si no hay configuración, la creamos
    const nuevaConfig = configuracionRepo.create({
      nombreEmpresa: 'La Martina',
      telefonoContacto: '+57 300 0000000',
      correoContacto: 'contacto@lamartina.com',
      direccionFisica: 'Bogotá, Colombia',
      horarioAtencion: 'Lunes a Viernes 8:00 AM - 5:00 PM',
      redesSociales: [
        { plataforma: 'Instagram', url: 'https://instagram.com/lamartina' }
      ]
    });
    
    return await configuracionRepo.save(nuevaConfig);
  },

  /**
   * Actualiza la configuración global
   */
  async actualizarConfiguracion(data: Partial<ConfiguracionGlobal>): Promise<ConfiguracionGlobal> {
    const config = await this.obtenerConfiguracion();
    
    Object.assign(config, data);
    
    return await configuracionRepo.save(config);
  }
};
