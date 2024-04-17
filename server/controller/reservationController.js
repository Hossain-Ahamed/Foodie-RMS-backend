const Reservation =  require("../model/reservationModel");
const Restaurant = require("../model/restaurantModel");
const axios = require("axios");
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
      const rest = await Restaurant.findOne({ _id: res_id });

      if(status){
        let cleanedNumber = user_phone.replace(/^\+88/, '');
        const message = `Dear ${user_name},%0AWe're thrilled to inform you that your reservation at ${rest.res_name} has been successfully approved! Your table is now reserved for ${date} at ${timeSlot}, and we can't wait to host you for a delightful dining experience.`
        const smsResponse = await axios.post(
          `https://bulksmsbd.net/api/smsapi?api_key=${process.env.BULK_MESSAGE_API}&type=text&number=${cleanedNumber}&senderid=${process.env.BULK_MESSAGE_SENDER}&message=${message}`
        );
      }
  
      res.status(201).json(newReservation);
    } catch (error) {
      console.error("Error creating reservation:", error);
      res.status(500).json({ error: "Failed to create reservation" });
    }
  };

  const readReservations = async (req, res) => {
    try {
      const { res_id, branchID } = req.params;
      const pendingReservations = await Reservation.find({ branchID: branchID, status: "pending" });
      const confirmedReservations = await Reservation.find({ branchID: branchID, status: "confirmed" });
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
      const { _id, res_id } = req.params;
      const { table_number } = req.body;
      if (!table_number) {
        return res.status(400).json({ error: "Table number is required" });
      }
      const c = await Reservation.findById(_id).populate('branchID');
      const rest = await Restaurant.findOne({ _id: res_id });

      // const 
  
      const updatedReservation = await Reservation.findByIdAndUpdate(
        _id,
        { $set: { status: "confirmed", table_number } },
        { new: true }
      );
      if (!updatedReservation) {
        return res.status(404).json({ error: "Reservation not found" });
      }
      let cleanedNumber = c.user_phone.replace(/^\+88/, '');
      const message = `Dear ${c.user_name},%0AYour reservation at ${rest.res_name} - ${c?.branchID?.branch_name} has been approved! Table is reserved for ${ new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short", year: "numeric" }).format(new Date(c.date))} at ${new Date('1970-01-01T' + c.timeSlot + ':00').toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true})} for ${c.numberOfPeople} person at Table No ${table_number}.`
      const smsResponse = await axios.post(
          `https://bulksmsbd.net/api/smsapi?api_key=${process.env.BULK_MESSAGE_API}&type=text&number=${cleanedNumber}&senderid=${process.env.BULK_MESSAGE_SENDER}&message=${message}`
        );

        console.log(smsResponse)
      res.status(200).json(updatedReservation);
    } catch (error) {
      console.error("Error confirming reservation:", error);
      res.status(500).json({ error: "Failed to confirm reservation" });
    }
  };
  

  const cancelAndDeleteReservation = async (req, res) => {
    try {
      const { _id, res_id } = req.params;
      const reservation = await Reservation.findById(_id);
      if (!reservation) {
        return res.status(404).json({ error: "Reservation not found" });
      }
      if (reservation.status === "confirmed") {
        await Reservation.findByIdAndDelete(_id);
        return res.status(200).json({ error: "Reservation deleted" });
      }
      reservation.status = "cancelled";
      await reservation.save();
      const c = await Reservation.findById(_id);
      const rest = await Restaurant.findOne({ _id: res_id });
      let cleanedNumber = c.user_phone.replace(/^\+88/, '');
      const message = `Dear ${c.user_name},%0AWe regret to inform you that your reservation at ${rest.res_name} for ${c.date} at ${c.timeSlot} has been canceled.`
      const smsResponse = await axios.post(
          `https://bulksmsbd.net/api/smsapi?api_key=${process.env.BULK_MESSAGE_API}&type=text&number=${cleanedNumber}&senderid=${process.env.BULK_MESSAGE_SENDER}&message=${message}`
        );
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