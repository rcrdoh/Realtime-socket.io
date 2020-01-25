const  mongoose  = require("mongoose");
const  Schema  =  mongoose.Schema;
const  TestSchema  =  new Schema(
    {
    name: {
    type: String
    },
    action: {
    type: String
        },
    message: {
    type: String
        }
    },
        {
    timestamps: true
});

let  test_messages  =  mongoose.model("test_messages", TestSchema);
module.exports  =  test_messages;
