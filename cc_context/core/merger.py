from typing import List, Dict
from cc_context.core.parser import Message, parse_jsonl_file
from cc_context.core.session import SessionInfo


def merge_sessions(sessions: List[SessionInfo]) -> List[Message]:
    all_messages = []
    session_boundaries = {}
    
    for session in sessions:
        messages = parse_jsonl_file(session.file_path)
        session.message_count = len(messages)
        
        for msg in messages:
            msg_dict = msg.to_dict()
            msg_dict['_session_id'] = session.session_id
            all_messages.append((msg, msg_dict))
    
    all_messages.sort(key=lambda x: x[0].timestamp)
    
    merged = []
    current_session = None
    prev_uuid = None
    
    for msg, msg_dict in all_messages:
        session_id = msg_dict['_session_id']
        
        if current_session != session_id:
            if current_session is not None:
                boundary_msg = Message(
                    type="system",
                    content=f"--- USER STARTED NEW SESSION ({session_id}) ---",
                    timestamp=msg.timestamp,
                    uuid=f"boundary-{session_id}",
                    parent_uuid=prev_uuid
                )
                merged.append(boundary_msg)
                prev_uuid = boundary_msg.uuid
            current_session = session_id
        
        relinked_msg = Message(
            type=msg.type,
            content=msg.content,
            timestamp=msg.timestamp,
            uuid=msg.uuid,
            parent_uuid=prev_uuid if prev_uuid else None
        )
        merged.append(relinked_msg)
        prev_uuid = relinked_msg.uuid
    
    return merged


def get_message_stats(messages: List[Message]) -> Dict[str, int]:
    stats = {
        "total_messages": len(messages),
        "user_messages": sum(1 for m in messages if m.type == "user"),
        "assistant_messages": sum(1 for m in messages if m.type == "assistant"),
        "system_messages": sum(1 for m in messages if m.type == "system"),
    }
    return stats
