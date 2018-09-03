module.exports = function locationRouter(koarouter, controllers) {
  return function(appRouter) {
    const router = koarouter();

    /**
     * @swagger
     * /fetchalllocations:
     *   get:
     *     x-name: fetchAllLocations
     *     description: retrieve all locations
     *     operationId: fetchAllLocations
     *     responses:
     *       200:
     *         description: Success
     *         schema:
     *           $ref: "#/definitions/locationsResponse"
     *       422:
     *         description: Failure
     *         schema:
     *             $ref: "#/definitions/standardFailureResponse"
     *       500:
     *         description: Failure
     *         schema:
     *             $ref: "#/definitions/standardFailureResponse"
     */
    router.get(
      '/fetchalllocations',
      controllers.locationListController.fetchAllLocations,
    );
    /**
     * @swagger
     * /location/addlocation:
     *   post:
     *     x-name: /location/addLocation
     *     description: add location
     *     operationId: /location/addLocation
     *     parameters:
     *       - name: body
     *         in: body
     *         required: true
     *         schema:
     *           $ref: "#/definitions/location"
     *     responses:
     *       200:
     *         description: Success
     *         schema:
     *             $ref: "#/definitions/standardSuccessResponse"
     *       422:
     *         description: Failure
     *         schema:
     *             $ref: "#/definitions/standardFailureResponse"
     *       500:
     *         description: Failure
     *         schema:
     *             $ref: "#/definitions/standardFailureResponse"
     *
     */
    router.post(
      '/location/addlocation',
      controllers.locationController.addLocation,
    );
    /**
     * @swagger
     * /location/updatelocation:
     *   post:
     *     x-name: /location/updateLocation
     *     description: update Location
     *     operationId: /location/updateLocation
     *     parameters:
     *       - name: body
     *         in: body
     *         required: true
     *         schema:
     *           $ref: "#/definitions/updateLocation"
     *     responses:
     *       200:
     *         description: Success
     *         schema:
     *             $ref: "#/definitions/standardSuccessResponse"
     *       422:
     *         description: Failure
     *         schema:
     *             $ref: "#/definitions/standardFailureResponse"
     *       500:
     *         description: Failure
     *         schema:
     *             $ref: "#/definitions/standardFailureResponse"
     */
    router.post(
      '/location/updatelocation',
      controllers.locationController.updateLocation,
    );
    /**
     * @swagger
     * /location/getlocation/{locationId}:
     *   get:
     *     x-name: location
     *     description: retrieve single location by id
     *     operationId: location
     *     parameters:
     *       - name: locationId
     *         in: path
     *         required: true
     *         description: The location id
     *         type: string
     *     responses:
     *       200:
     *         description: Success
     *         schema:
     *             $ref: "#/definitions/standardSuccessResponse"
     *       422:
     *         description: Failure
     *         schema:
     *             $ref: "#/definitions/standardFailureResponse"
     */
    router.get(
      '/location/getlocation/:locationId',
      controllers.locationController.getLocation,
    );
    /**
     * @swagger
     * /location/archivelocation:
     *   post:
     *     x-name: /location/archiveLocation
     *     description: archive Location
     *     operationId: /location/archiveLocation
     *     parameters:
     *       - name: body
     *         in: body
     *         required: true
     *         schema:
     *           $ref: "#/definitions/archiveLocation"
     *     responses:
     *       200:
     *         description: Success
     *         schema:
     *             $ref: "#/definitions/standardSuccessResponse"
     *       422:
     *         description: Failure
     *         schema:
     *             $ref: "#/definitions/standardFailureResponse"
     */
    router.post(
      '/location/archivelocation',
      controllers.locationController.archiveLocation,
    );

    appRouter.use(router.routes(), router.allowedMethods());
  };
};
