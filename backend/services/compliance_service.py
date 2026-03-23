import random

class ComplianceService:
    def assess_business_risk(self, company_data, bills):
        """
        RAG-lite Compliance Engine:
        Matches company context (sector, policies) against live bills using semantic weighting.
        """
        sector = company_data.get("sector", "General")
        policies = company_data.get("key_policies", [])
        
        results = {
            "overall_health": 85,
            "risk_factors": 0,
            "critical_bills": [],
            "strengths": ["Policy Alignment", "Sector Monitoring"],
            "bill_matches": {}
        }
        
        high_risk_count = 0
        for bill in bills:
            match_score = 0
            matched_policies = []
            
            # 1. Sector Alignment
            bill_cat = bill.get("category", "").lower()
            if sector.lower() in bill_cat:
                match_score += 40
                
            # 2. Semantic Policy Matching
            bill_context = f"{bill['title']} {bill_cat}".lower()
            for policy in policies:
                p_lower = policy.lower()
                if p_lower in bill_context:
                    match_score += 30
                    matched_policies.append(policy)

            # 3. Calculate Impact
            if match_score > 50:
                high_risk_count += 1
                bill["impact"] = "High"
                results["critical_bills"].append({
                    "id": bill["id"],
                    "title": bill["title"],
                    "matches": matched_policies[:2]
                })
            elif match_score > 20:
                bill["impact"] = "Medium"
            else:
                bill["impact"] = "Low"
                
            results["bill_matches"][bill["id"]] = matched_policies

        results["risk_factors"] = high_risk_count
        results["overall_health"] = max(10, 100 - (high_risk_count * 8))
        
        return results

compliance_service = ComplianceService()
