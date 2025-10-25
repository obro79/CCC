from typing import List, Dict
from cc_context.core.parser import Message, parse_jsonl_file
from cc_context.core.session import SessionInfo


def merge_sessions(sessions: List[SessionInfo]) -> List[Message]:
    # Sessions are already sorted by modified_time from discover_sessions()
    # Process sessions in order without interleaving individual messages
    merged = []
    prev_uuid = None

    for session in sessions:
        messages = parse_jsonl_file(session.file_path)
        session.message_count = len(messages)

        # Add session boundary marker (except for first session)
        if len(merged) > 0:
            boundary_msg = Message(
                type="system",
                content=f"--- USER STARTED NEW SESSION ({session.session_id}) ---",
                timestamp=messages[0].timestamp if messages else session.modified_time,
                uuid=f"boundary-{session.session_id}",
                parent_uuid=prev_uuid
            )
            merged.append(boundary_msg)
            prev_uuid = boundary_msg.uuid

        # Add all messages from this session
        for msg in messages:
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
