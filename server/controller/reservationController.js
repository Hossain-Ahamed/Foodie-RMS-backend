const Reservation =  require("../model/reservationModel");

const createReservation = async (req, res) => {
    try {
      const {  user_name, user_phone, table_number, date, timeSlot, numberOfPeople,status } = req.body;
      const {res_id, branchID,user_id} = req.params
      const newReservation = await new Reservation({
        res_id,
        branchID,
        user_id,
        user_name,
        user_phone,
        table_number,
        date,
        timeSlot,
        numberOfPeople,
        status
      }).save();
  
      res.status(201).json(newReservation);
    } catch (error) {
      console.error("Error creating reservation:", error);
      res.status(500).json({ error: "Failed to create reservation" });
    }
  };

  const readReservations = async (req, res) => {
    try {
      const { res_id, branchID } = req.params;
      const pendingReservations = await Reservation.find({ res_id, branchID, status: "pending" });
      const confirmedReservations = await Reservation.find({ res_id, branchID, status: "confirmed" });
      const reservations = {
        pending: pendingReservations,
        confirmed: confirmedReservations
      };
      res.status(200).json(reservations);
    } catch (error) {
      console.error("Error reading reservations:", error);
      res.status(500).json({ error: "Failed to fetch reservations" });
    }
  };
  

  const confirmReservation = async (req, res) => {
    try {
      const { _id } = req.params;
      const { table_number } = req.body;
      if (!table_number) {
        return res.status(400).json({ error: "Table number is required" });
      }
  
      const updatedReservation = await Reservation.findByIdAndUpdate(
        _id,
        { $set: { status: "confirmed", table_number } },
        { new: true }
      );
      if (!updatedReservation) {
        return res.status(404).json({ error: "Reservation not found" });
      }
      res.status(200).json(updatedReservation);
    } catch (error) {
      console.error("Error confirming reservation:", error);
      res.status(500).json({ error: "Failed to confirm reservation" });
    }
  };
  

  const cancelAndDeleteReservation = async (req, res) => {
    try {
      const { _id } = req.params;
      const reservation = await Reservation.findById(_id);
      if (!reservation) {
        return res.status(404).json({ error: "Reservation not found" });
      }
      if (reservation.status === "cancelled") {
        return res.status(400).json({ error: "Reservation already cancelled" });
      }
      reservation.status = "cancelled";
      await reservation.save();
      await Reservation.findByIdAndDelete(_id);
      res.status(200).json({ message: "Reservation cancelled and deleted successfully" });
    } catch (error) {
      console.error("Error cancelling and deleting reservation:", error);
      res.status(500).json({ error: "Failed to cancel and delete reservation" });
    }
  };

  module.exports = {
    cancelAndDeleteReservation,
    confirmReservation,
    readReservations,
    createReservation
  };