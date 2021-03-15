import { BrokherContract } from './contracts/BrokherContract';
interface BrokherInterface extends BrokherContract<any, any> {
    init(): BrokherInterface;
}
export declare function setup(brokherName: string): Promise<BrokherInterface>;
export {};
