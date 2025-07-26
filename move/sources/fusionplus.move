module fusionplus::message_sink;

use std::string;

public struct Message has key {
    id: UID,
    content: string::String,
}

public entry fun receive_message(content: string::String, ctx: &mut TxContext) {
    let msg = Message {
        id: object::new(ctx),
        content,
    };
    transfer::transfer(msg, tx_context::sender(ctx));
}
