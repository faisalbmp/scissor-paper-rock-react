import React, { useEffect, useState } from "react";
import mqtt from 'mqtt';

const mqttOption = {
    protocol: 'mqtts',

    clientId: `mqttjs_ + ${Math.random().toString(16).substr(2, 8)}`,
};
const host = 'mqtt://test.mosquitto.org:8081'

const useConnectmqtt = (readyPlayer) => {
    const [client, setClient] = useState(null);


    useEffect(() => {
        !client && setClient(mqtt.connect(host, mqttOption))
        readyPlayer();
    }, [readyPlayer, client])
    return {
        client
    }
}

export default useConnectmqtt;