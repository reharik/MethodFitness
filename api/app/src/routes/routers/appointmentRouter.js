module.exports = function appointmentRouter(koarouter, controllers) {
  return function (appRouter) {

    const router = koarouter();
    /**
     * @swagger
     * /fetchAppointments/{startDate}/{endDate}:
     *   get:
     *     x-name: fetchAppointments
     *     description: fetch Appointments
     *     operationId: fetchAppointments
     *     parameters:
     *       - name: startDate
     *         in: path
     *         required: true
     *         description: the beginning of the span of time to retrieve appointments for
     *         type: string
     *       - name: endDate
     *         in: path
     *         required: true
     *         description: the ending of the span of time to retrieve appointments for
     *         type: string
     *     responses:
     *       200:
     *         description: Success
     *         schema:
     *             $ref: "#/definitions/appointmentsResponse"
     */
    /**
     * @swagger
     * /fetchAppointments/{startDate}/{endDate}/{trainerId}:
     *   get:
     *     x-name: fetchAppointments
     *     description: fetch Appointments
     *     operationId: fetchAppointments
     *     parameters:
     *       - name: startDate
     *         in: path
     *         required: true
     *         description: the beginning of the span of time to retrieve appointments for
     *         type: string
     *       - name: endDate
     *         in: path
     *         required: true
     *         description: the ending of the span of time to retrieve appointments for
     *         type: string
     *       - name: trainerId
     *         in: path
     *         required: false
     *         description: the trainer id for whom to retrieve appointments
     *         type: string
     *     responses:
     *       200:
     *         description: Success
     *         schema:
     *             $ref: "#/definitions/appointmentsResponse"
     */
    router.get("/fetchAppointments/:startDate/:endDate/:trainerId?", controllers.appointmentController.fetchAppointments);
    /**
     * /fetchAppointment:
     *   get:
     *     x-name: fetchAppointment
     *     description: fetch Appointment by id
     *     operationId: fetchAppointment
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: The appointment id
     *         type: string
     *     responses:
     *       200:
     *         description: Success
     *         schema:
     *             $ref: "#/definitions/appointment"
     */
    router.get("/fetchAppointment/:id", controllers.appointmentController.fetchAppointment);
    /**
     * @swagger
     * /appointment/scheduleAppointment:
     *   post:
     *     x-name: /appointment/scheduleAppointment
     *     description: schedule Appointment
     *     operationId: /appointment/scheduleAppointment
     *     parameters:
     *       - name: body
     *         in: body
     *         required: true
     *         schema:
     *           $ref: "#/definitions/scheduleAppointment"
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
    router.post("/appointment/scheduleAppointment", controllers.appointmentController.scheduleAppointment);
    /**
     * @swagger
     * /appointment/updateAppointment:
     *   post:
     *     x-name: /appointment/updateAppointment
     *     description: update Appointment
     *     operationId: /appointment/updateAppointment
     *     parameters:
     *       - name: body
     *         in: body
     *         required: true
     *         schema:
     *           $ref: "#/definitions/scheduleAppointment"
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
    router.post("/appointment/updateAppointment", controllers.appointmentController.updateAppointment);
    /**
     * @swagger
     * /appointment/cancelAppointment:
     *   post:
     *     x-name: /appointment/cancelAppointment
     *     description: cancel Appointment
     *     operationId: /appointment/cancelAppointment
     *     parameters:
     *       - name: body
     *         in: body
     *         required: true
     *         schema:
     *           $ref: "#/definitions/cancelAppointment"
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
    router.post("/appointment/cancelAppointment", controllers.appointmentController.cancelAppointment);


    appRouter.use(router.routes(), router.allowedMethods());
  };
};
