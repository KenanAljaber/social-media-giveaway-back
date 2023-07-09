module.exports= (router,methods)=>{

    router.get('/:encodedUrl',methods.getPostCommentsByLink);
    return router;
}