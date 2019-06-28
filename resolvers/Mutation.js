import uuidv4 from 'uuid/v4'
import bcrypt from 'bcryptjs'
import {newStudentSchema} from '../db/student.js';

// Data for new message
const Chat = require("../db/chat");

const Mutation = {
    singleUploadPDF: async (parent, args, {db, models, GridFS, pubsub, utils:{uploadFile, getFile} }, info) => {
      const { stream, filename, mimetype, encoding } = await args.data
      const id = uuidv4();
      const result  = await uploadFile(GridFS, stream, {id:id, filename:filename});
      console.log('Upload...'+result)
      const Upload = {_id:id, filename, mimetype, encoding}
      const newUpload = new models.Uploadpdf(Upload)
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
      
      return output_file;
    },

    deletePDF: async (parent, args, { db, pubsub, models, GridFS, utils:{ deleteFile }}, info) => {

      await models.Uploadpdf.findByIdAndRemove({ _id: args.data.id });
      const result  = await deleteFile(GridFS, args.data.id);
      console.log(result)
      const output_file = {
        id: args.data.id,
        filename: args.data.filename 
      }
      pubsub.publish('PDF', {
        PDF: {
          mutation: 'DELETED',
          data: output_file
        }
      })
      return output_file
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


    createTodo: async (parent, args, { db, pubsub, models, req }, info) => {
      const Todo = {
        id: uuidv4(),
        ...args.data
      }
      const newTodo = new models.Todo(Todo);
      try {
        await newTodo.save();
      } catch (e) {
        throw new Error('Cannot Save Todo!!!');
      }
      pubsub.publish('TODO', {
        TODO: {
          mutation: 'CREATED',
          data: Todo
        }
      })
      return Todo;
    },

    deleteTodo: async (parent, args, { db, pubsub, models, req }, info) => {
      const Todos = await models.Todo.find({});
      const todoIndex = Todos.findIndex(Todo => Todo.id === args.id);
      await models.Todo.findByIdAndRemove({ _id: Todos[todoIndex]._id })
      const [Todo] = Todos.splice(todoIndex, 1)
      pubsub.publish('TODO', {
        TODO: {
          mutation: 'DELETED',
          data: Todo
        }
      })
      return Todo
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
    },

    studentPic: async (parent, args, {db, models, pubsub, req}, info) => {
      const { pic, filename, page, student } = await args.data;
      const id = uuidv4();
      const data = {
        id: id,
        pic: pic,
        filename: filename,
        page: page,
        student: student
      }
      /* New Schema */
      if(!models[student]){
        console.log( "New Schema ",student);
        let newSchema = newStudentSchema(student);
        models[student] = newSchema;
        const newList = new models.StudentsList({name: student})
        try {
          await newList.save();
        } 
        catch (e) {
          throw new Error('Cannot Save ',student ,'!!!');
        }
      }
      const Students = await models[student].find({});
      let exist = false;
      exist = Students.some(
        (pic) => (pic.filename===data.filename && pic.page===data.page)
      );
      if(exist){
        console.log("StudentPic update!");
        let query = {'filename': data.filename, 'page': data.page};
        models[student].findOneAndUpdate(query, { id: data.id, pic: data.pic },  function(err, doc){
          if (err) console.log(err);
        });
      }
      else{
        console.log("StudentPic new!");
        const newPic = new models[student](data)
        try {
          await newPic.save();
        } 
        catch (e) {
          throw new Error('Cannot Save ',student ,'!!!');
        }
      }
      if(exist){
        pubsub.publish('studentPIC', {
          studentPIC: {
            mutation: 'UPDATED',
            data: data
          }
        })
      }
      else{
        pubsub.publish('studentPIC', {
          studentPIC: {
            mutation: 'CREATED',
            data: data
          }
        })
      }
      return data
    },

    sendMessage: async (parent, {from, message}, { db, pubsub, models}, info) => {
      let data = new Chat();
      data.chat.from = from
      data.chat.message = message
      await data.save(err => {
        if (err) console.log('error');
        return console.log('good');
      });
      
      let chat = {id: 0, from , message}
      await models.Chat.find((err, data) => {
        if (err) { console.log('error');}
        else{ 
          chat.id = data.length + 1
          pubsub.publish('CHAT_CHANNEL', { messageSent: chat })
        }
      });
      return chat
    }
}

export { Mutation as default }