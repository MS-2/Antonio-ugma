


module.exports = {

    mostrarPrincipal: async(req,res)=> {
      res.render('principal');
    },
    mostrarVideo: async(req,res)=> {
      res.render('video');
    },
    mostrarInstal: async(req,res)=> {
      res.render('instal');
    },
    mostrarFunciones: async(req,res)=> {
      res.render('funciones');
    },
    mostrarPrimitivos: async(req,res)=> {
      res.render('primitivos');
    },
    mostrarInterprete: async(req,res)=> {
      res.render('interprete');
    },
    listar: async(req,res)=> {
      res.render('index');
    },


          

};


  
