import { createWriteStream, unlinkSync } from 'fs'
import uuidv4 from 'uuid/v4'
import uploads from '../db/upload'
import { resolve } from 'path'

const pump = require('pump-promise');

const uploadDir = resolve(__dirname, '../public')

const storeDB = async(file) => {
    const { id, filename, mimetype, path } = file;
    try {
        let file = new uploads({id, filename, mimetype, path });
        return await file.save();
    } catch (err) {
        return err
    }
}

const storeFS = ({ stream, filename }) => {
    const id = uuidv4()
    const path = `${uploadDir}/${id}-${filename}`
    return new Promise((resolve, reject) =>
        stream.on('error', error => {
            if (stream.truncated) unlinkSync(path)
            reject(error)
        })
        .pipe(createWriteStream(path))
        .on('error', error => reject(error))
        .on('finish', () => resolve({ id, path}))
    )
}

export const processUpload = async upload => {
    const { createReadStream, filename, mimetype, encoding } = await upload
    const stream = createReadStream()
    const { id, path} = await storeFS({ stream, filename })
    return storeDB({ id, filename, mimetype, path })
}



export const uploadFile = async (bucket, stream, options) => {

    const writestream = bucket.openUploadStreamWithId(options.id, options.filename);
    await pump(stream, writestream);
    return Promise.resolve(writestream.filename);
}

export const getFile = (bucket, _id) => {
    var buf = new Buffer('');
    return new Promise(function(resolve, reject) {
      var readstream = bucket.openDownloadStream(_id);
      readstream.on('data', (chunk) => {
        buf = Buffer.concat([buf, chunk]);
      });
      readstream.on('error', (err) => {
          reject(err);
      });
      readstream.on('end', () => {
          var res = buf.toString('base64');
          buf = null; // Clean up memory
          readstream.destroy();
          resolve(res);
      });
    });
  }