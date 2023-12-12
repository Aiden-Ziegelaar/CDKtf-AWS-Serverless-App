import { RdsCluster, RdsClusterConfig } from "@cdktf/provider-aws/lib/rds-cluster";
import { Construct } from "constructs";

interface RdsSmClusterConfig extends RdsClusterConfig {
    manage_master_user_password: true;
    password?: never;
}

export class RdsSmCluster extends RdsCluster {
    constructor(
        scope: Construct, 
        name: string, 
        config: RdsSmClusterConfig
    ) {
        super(scope, name, config);
    }
}