import 'reflect-metadata';

import { Client } from './Client';
import { Config, Logger } from '../../shared/Util';

const client: Client = new Client({
    token: 'Mzg1NTIxNzI4MjQ5NjU5Mzkz.D3Jh-w.F8JTC6J3EB0dwqqtTdMDrFWXUzw',
    prefix: '>>',
    clientOptions: {},
    roots: ['96626362277720064'],
    config: Config,
    logger: Logger
});
