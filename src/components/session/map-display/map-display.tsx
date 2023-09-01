import { Map, Marker } from "pigeon-maps";
import { IUser } from "../../../models/session";
import { stamenToner } from "pigeon-maps/providers";

interface IProps {
  user: IUser;
  users: IUser[];
}

const MapDisplay = ({ user, users }: IProps) => {
  return (
    <div>
      {user && users && (
        <div className="map">
          <Map
            provider={stamenToner}
            defaultCenter={[user.coords.latitude, user.coords.longitude]}
            defaultZoom={15}
          >
            {users.map((u) => (
              <Marker
                key={u.id}
                width={30}
                anchor={[u.coords.latitude, u.coords.longitude]}
                color={"indianred"}
              />
            ))}
          </Map>
        </div>
      )}
    </div>
  );
};

export default MapDisplay;
