import uuidv4 from 'uuid/v4'
import bcrypt from 'bcryptjs'


const Mutation = {
    singleUploadPDF: async (parent, args, {db, models, GridFS, pubsub, utils:{uploadFile, getFile} }, info) => {
      console.log(args.data)
      const { stream, filename, mimetype, encoding } = await args.data
      const id = uuidv4();
      const result  = await uploadFile(GridFS, stream, {id:id, filename:filename});
      console.log('Upload...'+result)
      const Upload = {id, filename, mimetype, encoding}
      const newUpload = new models.Uploadmore(Upload)
      try {
        await newUpload.save();
      } catch (e) {
        throw new Error('Cannot Save Upload!!!');
      }
      
      const file_string = await getFile(GridFS,id);
      const output_file = {
        id:id, 
        filename: filename,
        mimetype: mimetype,
        encoding: encoding,
        pdf:file_string
      }
      pubsub.publish('PDF', {
        PDF: {
          mutation: 'CREATED',
          data: output_file
        }
      })
      
      return Upload;
    },
    
    createUser: async (parent, args, { db, pubsub, models}, info) => {

      const Users = await models.User.find({});
      const emailTaken = Users.some(user => user.email === args.data.email)
      if (emailTaken) {
        throw new Error('Email taken')
      }
  
      const pwd = await bcrypt.hashSync(args.data.pwd, 10)
      const user = {
        id: uuidv4(),
        ...args.data
      }
      user["pwd"] = pwd

      const newUser = new models.User(user)
      try {
        await newUser.save();
      } catch (e) {
        throw new Error('Cannot Save User!!!');
      }
      return user
    },

    loginUser: async (parent, args, { db, pubsub, models, req }, info) => {
    
      const Users = await models.User.find({});
      const emailTaken = Users.some(user => user.email === args.data.email)
      if (emailTaken){
        const userIndex = Users.findIndex(user => user.email === args.data.email)
        if (await bcrypt.compareSync(args.data.pwd, Users[userIndex].pwd)) {
          req.session.user = Users[userIndex];
          //console.log(req.session)
          return Users[userIndex];
        }
        throw new Error('Incorrect password.');
      }
      throw new Error('No Such User exists.');
    },

    signoutUser: async (parent, args, { db, pubsub, models, req }, info) => {
      if (typeof req.session.user !== 'undefined'){
        req.session.user = null
        return true
      }
      return false
    },

    teacherPic: async (parent, args, {db, models, pubsub, req}, info) => {
      const { pic, filename, page } = await args.data;
      const id = uuidv4();
      const data = {
        id: id,
        pic: pic,
        filename: filename,
        page: page
      }
      const Teacher = await models.Teacher.find({});
      let exist = false;
      exist = Teacher.some(
        (pic) => (pic.filename===data.filename && pic.page===data.page)
      );
      if(exist){
        console.log("teacherPic update!");
        let query = {'filename': data.filename, 'page': data.page};
        models.Teacher.findOneAndUpdate(query, { id: data.id, pic: data.pic },  function(err, doc){
          if (err) console.log(err);
        });
      }
      else{
        console.log("teacherPic new!");
        const newteacher = new models.Teacher(data)
        try {
          await newteacher.save();
        } 
        catch (e) {
          throw new Error('Cannot Save User!!!');
        }
      }
      if(exist){
        pubsub.publish('PIC', {
          PIC: {
            mutation: 'UPDATED',
            data: data
          }
        })
      }
      else{
        pubsub.publish('PIC', {
          PIC: {
            mutation: 'CREATED',
            data: data
          }
        })
      }
      return data
    }
}

export { Mutation as default }