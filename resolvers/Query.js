const Query = {
    getPDFs: async (parent, args, { db, req, models, GridFS, utils: {getFile} } , info) => {
        const file_infos = await models.Uploadmore.find({});
        const files = []
        for (var i = 0; i < file_infos.length; i++){
            const id = file_infos[i].id
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

    getUSERs: async(parent, args, { db, models, req }, info) => {
        const Users = await models.User.find({});  
        return Users;
    },

    getTeacherPic:  async(parent, args, { db, models, req }, info) => {
        const Teacher = await models.Teacher.find({});  
        return Teacher;
    },
}

export { Query as default }