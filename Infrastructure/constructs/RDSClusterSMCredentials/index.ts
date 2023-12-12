import { 
    RdsClusterInstance, 
    RdsClusterInstanceConfig 
} from "@cdktf/provider-aws/lib/rds-cluster-instance";
import { Construct } from "constructs";

interface RdsSmClusterInstanceConfig extends RdsClusterInstanceConfig {
    manage_master_user_password: true;
    password: never;
}

export class RdsSmClusterInstance extends RdsClusterInstance {
    constructor(scope: Construct, name: string, config: RdsSmClusterInstanceConfig) {
        super(scope, name, config);
    }
}