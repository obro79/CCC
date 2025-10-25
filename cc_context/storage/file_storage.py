from pathlib import Path
from cc_context.storage.base import ContextStorage
from cc_context.utils.path import get_context_dir


class FileStorage(ContextStorage):

    def __init__(self, storage_dir: Path | None = None):
        if storage_dir is None:
            self.storage_dir = get_context_dir()
        else:
            self.storage_dir = storage_dir

        self.storage_dir.mkdir(parents=True, exist_ok=True)

    def _get_context_path(self, git_hash: str) -> Path:
        return self.storage_dir / f"{git_hash}.json"

    ### COMMIT
    def store_context(self, git_hash: str, jsonl_data: str) -> bool:
        # TODO: Derek
        pass
    ###


    ### CHECKOUT
    def fetch_context(self, git_hash: str) -> str | None:
        # TODO: Aaryan
        pass

    def context_exists(self, git_hash: str) -> bool:
        return self._get_context_path(git_hash).exists()
    ###CHECKOUT
