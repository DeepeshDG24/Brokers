import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import { Broker } from "../entities/Broker";
import bcrypt from "bcryptjs";
import { getEmbedParamsForSingleReport } from "../helpers/embeddedConfigService";
import config from "../../config/config.json";
import { Role } from "../entities/Role";

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);
  private brokerRepository = AppDataSource.getRepository(Broker);
  private roleRepository = AppDataSource.getRepository(Role);

  async findUserByUsername(username: string) {
    return await this.userRepository.findOne({ where: { username } });
  }

  async createUser(username: string, password: string, name: string, brokerId: number) {
    const existingUser = await this.userRepository.findOne({ where: { username } });
    if (existingUser) throw new Error('Username already exists');

    const broker = await this.brokerRepository.findOneBy({ id: brokerId });
    if (!broker) throw new Error('Broker not found');

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User();
    newUser.username = username;
    newUser.password = hashedPassword;
    newUser.name = name;
    newUser.brokerId = brokerId;

    return await this.userRepository.save(newUser);
  }

  async findUserById(userId: number) {
    try{
      return await this.userRepository.findOneBy({ id: userId });
    } catch(error) {
       throw error
    } 
  }

  async getRolesById(roleId: number) {
    try{
      return await this.roleRepository.findOneBy({ id: roleId });
    } catch(error) {
       throw error
    } 
  }

  async getEmbedInfo(userEmailId: string, roles: any[]) {

    // Get the Report Embed details
    try {

        // Get report details and embed token
        const embedParams = await getEmbedParamsForSingleReport(config.workspaceId, config.reportId, userEmailId, roles);
        
        return {
            'accessToken': embedParams.embedToken.token,
            'embedUrl': embedParams.reportsDetail,
            'expiry': embedParams.embedToken.expiration,
            'status': 200
        };
    } catch (err: any) {
        return {
            'status': err.status,
            'error': `Error while retrieving report embed details\r\n${err.statusText}\r\nRequestId: \n}`
        }
    }
  }
  
}
