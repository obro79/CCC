from abc import ABC, abstractmethod


class ContextStorage(ABC):
    
    @abstractmethod
    def store_context(self, context_id: str, jsonl_data: str) -> bool:
        pass
    
    @abstractmethod
    def fetch_context(self, context_id: str) -> str | None:
        pass
    
    @abstractmethod
    def context_exists(self, context_id: str) -> bool:
        pass
