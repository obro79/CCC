from pathlib import Path
from cc_context.storage.base import ContextStorage
from cc_context.utils.path import get_repo_root


class FileStorage(ContextStorage):
    
    def __init__(self, storage_dir: Path | None = None):
        if storage_dir is None:
            repo_root = get_repo_root()
            self.storage_dir = repo_root / ".cc-contexts"
        else:
            self.storage_dir = storage_dir
        
        self.storage_dir.mkdir(parents=True, exist_ok=True)
    
    def _get_context_path(self, context_id: str) -> Path:
        return self.storage_dir / f"{context_id}.jsonl"
    
    def store_context(self, context_id: str, jsonl_data: str) -> bool:
        try:
            context_path = self._get_context_path(context_id)
            with open(context_path, 'w', encoding='utf-8') as f:
                f.write(jsonl_data)
            return True
        except Exception as e:
            print(f"Error storing context {context_id}: {e}")
            return False
    
    def fetch_context(self, context_id: str) -> str | None:
        try:
            context_path = self._get_context_path(context_id)
            if not context_path.exists():
                return None
            
            with open(context_path, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            print(f"Error fetching context {context_id}: {e}")
            return None
    
    def context_exists(self, context_id: str) -> bool:
        return self._get_context_path(context_id).exists()
