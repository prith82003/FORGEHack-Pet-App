import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Text, Image, useProductContext } from '@forge/react';
import { invoke } from '@forge/bridge';
import { requestConfluence } from '@forge/bridge';

import api, { route } from "@forge/api";

const page_id = 0;

const GetPageData = async (page_id) => {
    const res = await requestConfluence(`/wiki/rest/api/content/${page_id}?expand=body.atlas_doc_format`, {
        headers: {
            'Accept': 'application/json'
        }
    });

    if (!res.ok) {
        console.log("ERROR: ", res.status, res.statusText);
    }

    const data = JSON.parse((await res.json()).body.atlas_doc_format.value);
    return data
}


const App = () => {
    const [data, setData] = useState(null);
    const context = useProductContext();
    let [widgetCount, setWidgetCount] = useState(0);
    let [localIds, setLocalIds] = useState(new Set());


    const key = 'confluencemacro-macro';
    React.useEffect(() => {
        if (context) {
            const page_id = context.extension.content.id;
            GetPageData(page_id).then((data) => {
                for (const c of data.content) {
                    if (c.type != 'extension') continue;

                    if (c.attrs.extensionKey.endsWith(key) && !localIds.has(c.attrs.localId)) {
                        setLocalIds(new Set([...localIds, c.attrs.localId]));
                        setWidgetCount(widgetCount + 1);
                    }
                }
            })
        }

    }, [context, widgetCount, localIds])

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
