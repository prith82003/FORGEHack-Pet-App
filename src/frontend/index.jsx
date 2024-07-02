import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Text, Image, useProductContext } from '@forge/react';
import { invoke } from '@forge/bridge';
import { requestConfluence } from '@forge/bridge';

import api, { route } from "@forge/api";

const page_id = 0;

const GetWidgetCount = async (page_id) => {
  const res = await requestConfluence(`/wiki/rest/api/content/${page_id}?expand=body.atlas_doc_format`, {
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!res.ok) {
    console.log("ERROR: ", res.status, res.statusText);
  }

  const data = JSON.parse((await res.json()).body.atlas_doc_format.value);

  console.log("DATA: " + JSON.stringify(data, null, 2));

  return data
}


const App = () => {
  const [data, setData] = useState(null);
  const context = useProductContext();


  const key = 'confluencemacro-macro';
  let widgetCount = 0;
  React.useEffect(() => {
    console.log("Context: ", JSON.stringify(context, null, 2));
    if (context) {
      const page_id = context.extension.content.id;
      GetWidgetCount(page_id).then((data) => {
        console.log("Data: " + data);
      })
    }
  }, [context])


  return (
    <>
      <Text>Widget Count: {widgetCount}</Text>
      <Image
        src='https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg'
        alt='dog'
      />
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
