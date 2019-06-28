const Query = {
    getPDFs: async (parent, args, { db, req, models, GridFS, utils: {getFile} } , info) => {
        const file_infos = await models.Uploadpdf.find({});
        const files = []
        for (var i = 0; i < file_infos.length; i++){
            const id = file_infos[i]._id
            const file_string = await getFile(GridFS,id);
            const output_file = {
                id:file_infos[i].id, 
                filename: file_infos[i].filename,
                mimetype: file_infos[i].mimetype,
                encoding: file_infos[i].encoding,
                pdf:file_string
            }
            files.push(output_file);
        }
        return files
        //try { return await models.Upload.find({}) } catch (err) { return err }
    },

    isLogin: async (parent, args, { req }) => {
        //console.log(req.session)
        if (typeof req.session.user !== 'undefined')
          return req.session.user
        return null
    }, 

    getTODOs: async(parent, args, { db, models, req }, info) => {
        const Todos = await models.Todo.find({});  
        return Todos;
    },

    getUSERs: async(parent, args, { db, models, req }, info) => {
        const Users = await models.User.find({});  
        return Users;
    },

    getTeacherPic:  async(parent, args, { db, models, req }, info) => {
        const Teacher = await models.Teacher.find({});  
        return Teacher;
    },

    getStudentPic:  async(parent, args, { db, models, req }, info) => {
        const Students = await models[args.student].find({});  
        return Students;
    },

    chats: async (parent, args, { db, models, req }, info) => {
        const Chats = await models.Chat.find({});  
        var chats = []
        for (let i=0; i<Chats.length; i++) {
            let chat = Chats[i];
            chats.push({id:i+1, from:chat.chat.from, message:chat.chat.message})
        }
        return chats
    }
}

export { Query as default }