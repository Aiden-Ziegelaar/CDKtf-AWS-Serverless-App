import { 
    RdsCluster, RdsClusterConfig 
} from "@cdktf/provider-aws/lib/rds-cluster";
import { Construct, IConstruct } from "constructs";
import { Annotations, IAspect } from "cdktf";

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

export class RdsSmPunitiveAspect implements IAspect {
    visit(node: IConstruct): void {
        if (node instanceof RdsCluster) {
            if (node.manageMasterUserPasswordInput === false || node.masterPasswordInput !== undefined) {
                Annotations.of(node).addError(
                    "You must set manage_master_user_password to true."
                );
            }
        }
    }
}