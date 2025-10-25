import json
from pathlib import Path
from typing import List, Dict, Any
from dataclasses import dataclass


@dataclass
class Message:
    type: str
    content: str
    timestamp: str
    uuid: str
    parent_uuid: str | None
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "type": self.type,
            "content": self.content,
            "timestamp": self.timestamp,
            "uuid": self.uuid,
            "parentUuid": self.parent_uuid
        }


def parse_jsonl_file(file_path: Path) -> List[Message]:
    messages = []
    
    with open(file_path, 'r', encoding='utf-8') as f:
        for line_num, line in enumerate(f, 1):
            line = line.strip()
            if not line:
                continue
            
            try:
                data = json.loads(line)
                
                message = Message(
                    type=data.get("type", "unknown"),
                    content=data.get("content", ""),
                    timestamp=data.get("timestamp", ""),
                    uuid=data.get("uuid", f"missing-{line_num}"),
                    parent_uuid=data.get("parentUuid")
                )
                messages.append(message)
                
            except json.JSONDecodeError as e:
                print(f"Warning: Skipping corrupted line {line_num} in {file_path}: {e}")
                continue
            except Exception as e:
                print(f"Warning: Error processing line {line_num} in {file_path}: {e}")
                continue
    
    return messages


def validate_messages(messages: List[Message]) -> bool:
    if not messages:
        return True
    
    seen_uuids = set()
    for msg in messages:
        if msg.uuid in seen_uuids:
            print(f"Warning: Duplicate UUID found: {msg.uuid}")
            return False
        seen_uuids.add(msg.uuid)
    
    for i in range(1, len(messages)):
        if messages[i].timestamp < messages[i-1].timestamp:
            print(f"Warning: Timestamps not monotonically increasing")
            return False
    
    return True


def messages_to_jsonl(messages: List[Message]) -> str:
    lines = []
    for msg in messages:
        lines.append(json.dumps(msg.to_dict()))
    return '\n'.join(lines)
