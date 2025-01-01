export enum SocketEvents {
    send_msg = "message:send",
    recv_msg = "message:recieve",
    client_error = "client:error",

    call_create = "call:create",
    call_incoming = "call:incoming",

    call_user_join_lobby = "call:user:join:lobby",
    call_user_joined_lobby = "call:user:joined:lobby",

    call_join = "call:join",
    call_user_joined = "call:user:joined",

    call_decline = "call:decline",
    call_user_declined = "call:user:declined",

    call_user_offline = "call:user:offline",

    rtc_offer_send = "rtc:offer:send",
    rtc_offer_receive = "rtc:offer:receive",

    rtc_answer_send = "rtc:answer:send",
    rtc_answer_receive = "rtc:answer:receive",

    rtc_ice_candidates = "rtc:ice_candidates",

    call_leave = "call:leave",
    
    post_upload_success= "post:upload:success",
}