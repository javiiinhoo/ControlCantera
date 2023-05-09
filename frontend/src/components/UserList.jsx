import React from "react";
import UserCard from "./UserCard";

function UserList(props) {
  const { users, onApprove, onReject } = props;

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>



      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          onApprove={onApprove}
          onReject={onReject}
        />
      ))}
    </div>
  );
}

export default UserList;
