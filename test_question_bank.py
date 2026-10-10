import os
import json
import unittest

class TestQuestionBank(unittest.TestCase):
    def setUp(self):
        self.db_path = os.path.join(os.path.dirname(__file__), 'data', 'questions_db.json')
        self.assertTrue(os.path.exists(self.db_path), f"Database file missing: {self.db_path}")
        with open(self.db_path, 'r', encoding='utf-8') as f:
            self.data = json.load(f)

    def test_papers_count(self):
        """Must have exactly 5 papers"""
        self.assertEqual(len(self.data), 5, f"Expected 5 papers, got {len(self.data)}")

    def test_each_paper_structure(self):
        """Each paper must have 200 questions: 160 choice + 40 judge"""
        for paper in self.data:
            p_id = paper.get('id')
            p_name = paper.get('name')
            questions = paper.get('questions', [])
            
            self.assertEqual(len(questions), 200, f"Paper {p_id} ({p_name}) has {len(questions)} questions, expected 200")
            
            choices = [q for q in questions if q['type'] == 'choice']
            judges = [q for q in questions if q['type'] == 'judge']
            
            self.assertEqual(len(choices), 160, f"Paper {p_id} must have 160 single choices, got {len(choices)}")
            self.assertEqual(len(judges), 40, f"Paper {p_id} must have 40 judges, got {len(judges)}")
            
            # Check question fields
            for q in questions:
                idx = q.get('index')
                self.assertTrue(1 <= idx <= 200, f"Invalid question index: {idx}")
                self.assertTrue(bool(q.get('content')), f"Question {p_id} #{idx} has empty content")
                
                ans = q.get('answer')
                if q['type'] == 'choice':
                    self.assertIn(ans, ['A', 'B', 'C', 'D'], f"Paper {p_id} #{idx} choice answer '{ans}' invalid")
                    options = q.get('options', [])
                    self.assertTrue(len(options) >= 2, f"Paper {p_id} #{idx} options too short: {options}")
                else:
                    self.assertIn(ans, ['√', '×', '对', '错'], f"Paper {p_id} #{idx} judge answer '{ans}' invalid")
                    
                # Check images if present
                for img_rel in q.get('images', []):
                    img_abs = os.path.join(os.path.dirname(__file__), img_rel)
                    self.assertTrue(os.path.exists(img_abs), f"Image file not found: {img_abs} in {p_id} #{idx}")

if __name__ == '__main__':
    unittest.main()
