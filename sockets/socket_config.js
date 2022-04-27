const req = require("express/lib/request");

module.exports=function(io){
    var clients={}
    var num = 0;
    function html(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    io.use(function(socket, next) {
           
        xsession(socket.request, {}, next);
    })
        io.on("connection",async (socket)=>{
            if(socket.request.session.myid){
                

            clients[socket.request.session.candidate?socket.request.session.myid:socket.request.session.org]=socket.id

          
        

    socket.on('message',(data)=>{
        send_to = clients[data.user]
        myid=socket.request.session.candidate?socket.request.session.myid:socket.request.session.org
        //msg=html(data.msg)
       io.to(send_to).emit("message",{message:data.msg,user:myid})
    })
}
        })
    }



    