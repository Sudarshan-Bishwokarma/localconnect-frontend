import { useState } from "react";
import { FaBell } from "react-icons/fa";

const UserNotificationBell = () => {
  const notification = [
    "Order placed successfully",
    "Your order has been shipped",
  ];

  const [showNotification, setShowNotification] = useState(false);

  const toggleNotifications = () => {
    setShowNotification(!showNotification);
  };

  return (
    <div className="relative">
      <button onClick={toggleNotifications}>
        <FaBell className="text--gray-700 text-2xl  cursor-pointer" />
      </button>

      {showNotification && (
        <div className="absolute right-0 w-[170px] rounded mt-3 bg-white text-black shadow-lg">
          <ul>
            {notification.length === 0 ? (
              <li className="px-4 py-2 hover:bg-gray-200  cursor-pointer">
                No Notifications
              </li>
            ) : (
              notification.map((note, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-200  cursor-pointer"
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

export default UserNotificationBell;
