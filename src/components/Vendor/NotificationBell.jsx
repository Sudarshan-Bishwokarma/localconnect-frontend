import { useState } from "react";
import { FaBell } from "react-icons/fa";
const NotificationBell = () => {
  const [showNotification, setShowNotification] = useState(false);
  // static notification  for  now

  const notification = ["New Order Placed", "Vendor added a new product"];
  // fuction
  const toggleNotifications = () => {
    setShowNotification(!showNotification);
  };
  return (
    <div className="relative">
      <button onClick={toggleNotifications}>
        <FaBell className="text-2xl text-gray-700 cursor-pointer" />
      </button>
      {/* drop down */}
      {showNotification && (
        <div className="absolute right-0 w-[170px] rounded mt-3 bg-white text-black shadow-lg ">
          <ul>
            {notification.length === 0 ? (
              <li className=" px-4 py-2  hover:bg-gray-200 cursor-pointer">
                No Notifications
              </li>
            ) : (
              notification.map((note, index) => (
                <li
                  key={index}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                >
                  {note}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
export default NotificationBell;
