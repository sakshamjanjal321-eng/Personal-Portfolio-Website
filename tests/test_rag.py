import os
import unittest
from unittest.mock import MagicMock, patch
from vectorflow.ingestion.loaders.base import Document
from vectorflow.ingestion.chunkers.recursive import RecursiveCharacterTextSplitter
from vectorflow.embedders.local import LocalEmbedder
from vectorflow.stores.chroma import ChromaStore

class TestVectorFlow(unittest.TestCase):
    def test_recursive_splitter(self):
        text = "Hello world. This is a simple test of the recursive character text splitter. We split by spaces and sentences."
        doc = Document(content=text, metadata={"source": "test.txt"})
        
        splitter = RecursiveCharacterTextSplitter(chunk_size=30, chunk_overlap=5)
        chunks = splitter.chunk([doc])
        
        self.assertTrue(len(chunks) > 1)
        for c in chunks:
            self.assertTrue(len(c.content) <= 30)
            self.assertEqual(c.metadata["source"], "test.txt")

    def test_local_embedder_and_chroma(self):
        with patch('vectorflow.embedders.local.SentenceTransformer') as MockST:
            mock_model = MagicMock()
            import numpy as np
            mock_model.encode.return_value = np.array([[0.1, 0.2, 0.3, 0.4], [0.5, 0.6, 0.7, 0.8]])
            MockST.return_value = mock_model
            
            embedder = LocalEmbedder(model_name="dummy-model")
            store = ChromaStore(persist_directory=None)
            
            docs = [
                Document(content="RAG is cool", metadata={"id": 1}),
                Document(content="Modular architectures rock", metadata={"id": 2})
            ]
            
            embeddings = embedder.embed_documents([d.content for d in docs])
            store.add_documents("my-collection", docs, embeddings)
            
            mock_model.encode.return_value = np.array([0.1, 0.2, 0.3, 0.4])
            query_vector = embedder.embed_query("RAG")
            results = store.search("my-collection", query_vector, top_k=1)
            
            self.assertEqual(len(results), 1)
            self.assertEqual(results[0]["content"], "RAG is cool")
            self.assertEqual(results[0]["metadata"]["id"], 1)

if __name__ == "__main__":
    unittest.main()
