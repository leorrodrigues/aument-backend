/* istanbul ignore file */
import axios from 'axios';
import { createWriteStream } from 'fs';
import stream from 'stream';
import { promisify } from 'util';

import { DownloadFileProps } from '@/dtos/utils/functions/downloadFile';

const finished = promisify(stream.finished);

const downloadFile = async ({ fileUrl, filePath }: DownloadFileProps) => {
    const writer = createWriteStream(filePath);

    const response = await axios.get<any>(fileUrl, {
        responseType: 'stream',
    });

    response.data.pipe(writer);
    return finished(writer);
};

export default downloadFile;
