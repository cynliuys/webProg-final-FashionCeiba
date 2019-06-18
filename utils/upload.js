const streamToPromise = require('./stream-to-promise');
const pump = require('pump-promise');


export const deleteFile = async (bucket, id) => {
    const gridFSStream = bucket.delete(id);
    await streamToPromise(gridFSStream);
    return Promise.resolve('Delete Sucess!');
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