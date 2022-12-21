const { Client } = require("@elastic/elasticsearch");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

let client = null;

async function connectToElasticSearch() {
    try {
        client = new Client({
            //   cloud: { id: '<cloud-id>' },
            //   auth: { apiKey: 'base64EncodedKey' }
            node: "https://localhost:9200",
            auth: {
                username: "elastic",
                password: process.env.ELASTICSEARCH_PASSWORD,
            },
            tls: {
                ca: fs.readFileSync("./certificate/http_ca.crt"),
                rejectUnauthorized: false,
            },
        });

        const response = await client.info();
        console.log(
            "---------------------------------------------------------------------------------"
        );
        console.log(response);
        console.log(
            "---------------------------------------------------------------------------------"
        );
    } catch (error) {
        console.log("in create connection", error);
    }
}

async function getMapping() {
    try {
        const mapping = await client.indices.getMapping();
        console.log(mapping["game-of-thrones"]);
    } catch (error) {
        console.log("in getMapping", error);
    }
}

async function updateMapping() {
    const newMapping = {
        "properties": {
          "email": {
            "type": "keyword"
          }
        }
      }
    const res = await client.indices.putMapping(updateMapping);
}

async function addIndex() {
    try {
        // Let's start by indexing some data
        const docCreateRes = await client.index({
            // index: "users",
            // document: {
            //     first_name: "hardik",
            //     last_name: "bachhan",
            //     email: "hardik@gmail.com",
            //     password: "asdasdasd"
            // },
            index: "game-of-thrones",
            document: {
                character: [1],
                quote: "Winter is coming.int array",
            },
            // index: "game-of-thrones",
            // document: {
            //     character: "Daenerys Targaryen",
            //     quote: "I am the blood of the dragon.",
            // },
            // index: 'game-of-thrones',
            // document: {
            //     character: 'Tyrion Lannister',
            //     quote: 'A mind needs books like a sword needs a whetstone.'
            // }
        });
        console.log(docCreateRes);

        // here we are forcing an index refresh, otherwise we will not
        // get any result in the consequent search
        const res = await client.indices.refresh({ index: "game-of-thrones" });
        console.log(res);
    } catch (error) {
        console.log("in addIndex", error);
    }
}

async function search() {
    try {
        // Let's search!
        const result = await client.search({
            index: "game-of-thrones",
            query: {
                // match: { quote: "winter" },
                match_all: {},
            },
        });
        // console.log(result);
        console.log(result.hits.hits[5]["_source"]["character"]);
    } catch (error) {
        console.log("in search", error);
    }
}

async function get() {
    try {
        const result = await client.get({
            index: "game-of-thrones",
            id: "siVXC4UBXFYEmofrblIg",
        });
        console.log(result);
    } catch (error) {
        console.log(error);
    }
}

async function deleteDocument() {
    try {
        const result = await client.delete({
            index: "game-of-thrones",
            id: "siVXC4UBXFYEmofrblIg",
        });
        console.log(result);
    } catch (error) {
        console.log(error);
    }
}

async function updateDocument() {
    try {
        const result = await client.update({
            index: "game-of-thrones",
            id: "syVeC4UBXFYEmofrv1JP",
            body: {
                doc: {
                    quote: "this is test update for doc with character abc"
                }
            },
        });
        console.log(result);
    } catch (error) {
        console.log("updateDoc", error);
    }
}

(() => {
    connectToElasticSearch();
    // addIndex();
    search();
    // get();
    // deleteDocument();
    // updateDocument();
    // getMapping();
})();

async function run() {
    // Let's start by indexing some data
    // const nedStark = await client.index({
    //     index: "game-of-thrones",
    //     document: {
    //         character: "Ned Stark",
    //         quote: "Winter is coming.",
    //     },
    // });
    // console.log(nedStark);

    //   await client.index({
    //     index: 'game-of-thrones',
    //     document: {
    //       character: 'Daenerys Targaryen',
    //       quote: 'I am the blood of the dragon.'
    //     }
    //   })

    //   await client.index({
    //     index: 'game-of-thrones',
    //     document: {
    //       character: 'Tyrion Lannister',
    //       quote: 'A mind needs books like a sword needs a whetstone.'
    //     }
    //   })

    // here we are forcing an index refresh, otherwise we will not
    // get any result in the consequent search
    const res = await client.indices.refresh({ index: "game-of-thrones" });
    console.log(res);

    // Let's search!
    //   const result= await client.search({
    //     index: 'game-of-thrones',
    //     query: {
    //       match: { quote: 'winter' }
    //     }
    //   })

    //   console.log(result.hits.hits)
}

// run().catch(console.log)
