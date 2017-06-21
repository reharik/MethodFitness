module.exports = function clientRouter(koarouter, controllers) {
  return function(appRouter) {
    const router = koarouter();

    /**
     * @swagger
     * /auth:
     *   post:
     *     x-name: loggin
     *     description: checks credentials
     *     operationId: auth
     *     parameters:
     *       - name: body
     *         in: body
     *         required: true
     *         schema:
     *           $ref: "#/definitions/signIn"
     *     responses:
     *       200:
     *         description: Success
     *         schema:
     *             $ref: "#/definitions/auth"
     *       422:
     *         description: Failure
     *         schema:
     *             $ref: "#/definitions/standardFailureResponse"
     *       500:
     *         description: Failure
     *         schema:
     *             $ref: "#/definitions/standardFailureResponse"
     */
    // router.get("/auth", controllers.authController.checkAuth);
    router.post('/auth', controllers.authController.signIn);
    /**
     * @swagger
     * /signout:
     *   post:
     *     x-name: signout
     *     description: sign out
     *     operationId: signout
     *     responses:
     *       204:
     *         description: Success
     */
    router.all('/signout', controllers.authController.signOut);
    /**
     * @swagger
     * /swagger:
     *   get:
     *     x-name: swagger
     *     description: Returns swagger spec
     *     operationId: swagger
     *     responses:
     *       '200':
     *         description: Success
     *         schema:
     *           additionalProperties: {}
     */
    router.get('/swagger', controllers.swaggerController.swagger);

    appRouter.use(router.routes(), router.allowedMethods());
  };
};
