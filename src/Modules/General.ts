import {Module} from "../services/decorators";
import {BaseModule} from "../services";

@Module({
    name: 'General',
    description: 'Yeah'
})
export class General extends BaseModule {}
