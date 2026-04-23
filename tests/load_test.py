"""
Load Testing Script for AROHAN API
Performance validation and load testing
"""

import asyncio
import time
import statistics
from typing import List, Dict, Any
from httpx import AsyncClient, ASGITransport
from src.main import app


class LoadTester:
    """Load testing utility for API performance testing"""
    
    def __init__(self, base_url: str = "http://test"):
        """Initialize load tester
        
        Args:
            base_url: Base URL for API requests
        """
        self.base_url = base_url
        self.results: List[Dict[str, Any]] = []
    
    async def test_endpoint(
        self,
        method: str,
        path: str,
        **kwargs
    ) -> Dict[str, Any]:
        """Test a single endpoint
        
        Args:
            method: HTTP method
            path: API path
            **kwargs: Additional arguments for request
            
        Returns:
            Dict: Test result with timing information
        """
        async with AsyncClient(
            transport=ASGITransport(app=app),
            base_url=self.base_url
        ) as client:
            start_time = time.time()
            
            try:
                response = await client.request(method, path, **kwargs)
                end_time = time.time()
                
                return {
                    "method": method,
                    "path": path,
                    "status_code": response.status_code,
                    "response_time_ms": (end_time - start_time) * 1000,
                    "success": response.status_code < 400,
                    "error": None
                }
            except Exception as e:
                end_time = time.time()
                return {
                    "method": method,
                    "path": path,
                    "status_code": None,
                    "response_time_ms": (end_time - start_time) * 1000,
                    "success": False,
                    "error": str(e)
                }
    
    async def run_load_test(
        self,
        method: str,
        path: str,
        concurrent_requests: int = 10,
        total_requests: int = 100,
        **kwargs
    ) -> Dict[str, Any]:
        """Run load test on endpoint
        
        Args:
            method: HTTP method
            path: API path
            concurrent_requests: Number of concurrent requests
            total_requests: Total number of requests
            **kwargs: Additional arguments for request
            
        Returns:
            Dict: Load test results with statistics
        """
        print(f"\n🚀 Load Testing: {method} {path}")
        print(f"   Concurrent: {concurrent_requests}, Total: {total_requests}")
        
        results = []
        
        # Create semaphore to limit concurrent requests
        semaphore = asyncio.Semaphore(concurrent_requests)
        
        async def make_request():
            async with semaphore:
                result = await self.test_endpoint(method, path, **kwargs)
                results.append(result)
                return result
        
        # Run requests
        start_time = time.time()
        tasks = [make_request() for _ in range(total_requests)]
        await asyncio.gather(*tasks)
        end_time = time.time()
        
        # Calculate statistics
        response_times = [r["response_time_ms"] for r in results]
        successful_requests = [r for r in results if r["success"]]
        failed_requests = [r for r in results if not r["success"]]
        
        stats = {
            "endpoint": f"{method} {path}",
            "total_requests": total_requests,
            "successful_requests": len(successful_requests),
            "failed_requests": len(failed_requests),
            "success_rate": (len(successful_requests) / total_requests) * 100,
            "total_time_seconds": end_time - start_time,
            "requests_per_second": total_requests / (end_time - start_time),
            "response_time_ms": {
                "min": min(response_times) if response_times else 0,
                "max": max(response_times) if response_times else 0,
                "mean": statistics.mean(response_times) if response_times else 0,
                "median": statistics.median(response_times) if response_times else 0,
                "p95": statistics.quantiles(response_times, n=20)[18] if len(response_times) >= 20 else 0,
                "p99": statistics.quantiles(response_times, n=100)[98] if len(response_times) >= 100 else 0,
            },
            "errors": [r["error"] for r in failed_requests if r["error"]]
        }
        
        # Print results
        print(f"\n📊 Results:")
        print(f"   Success Rate: {stats['success_rate']:.2f}%")
        print(f"   Requests/Second: {stats['requests_per_second']:.2f}")
        print(f"   Response Time (ms):")
        print(f"     Min: {stats['response_time_ms']['min']:.2f}")
        print(f"     Mean: {stats['response_time_ms']['mean']:.2f}")
        print(f"     Median: {stats['response_time_ms']['median']:.2f}")
        print(f"     P95: {stats['response_time_ms']['p95']:.2f}")
        print(f"     P99: {stats['response_time_ms']['p99']:.2f}")
        print(f"     Max: {stats['response_time_ms']['max']:.2f}")
        
        if stats["errors"]:
            print(f"   Errors: {stats['errors'][:5]}")  # Show first 5 errors
        
        self.results.append(stats)
        return stats
    
    def print_summary(self):
        """Print summary of all load tests"""
        print("\n" + "="*60)
        print("📈 LOAD TEST SUMMARY")
        print("="*60)
        
        for result in self.results:
            print(f"\n{result['endpoint']}:")
            print(f"  Success Rate: {result['success_rate']:.2f}%")
            print(f"  Mean Response: {result['response_time_ms']['mean']:.2f}ms")
            print(f"  P95 Response: {result['response_time_ms']['p95']:.2f}ms")
            print(f"  Requests/Second: {result['requests_per_second']:.2f}")


async def run_performance_tests():
    """Run performance tests for key endpoints"""
    tester = LoadTester()
    
    print("\n" + "="*60)
    print("🚀 AROHAN API PERFORMANCE TESTS")
    print("="*60)
    
    # Test 1: Health Check (should be very fast)
    await tester.run_load_test(
        "GET",
        "/health",
        concurrent_requests=20,
        total_requests=100
    )
    
    # Test 2: Root Endpoint (should be very fast)
    await tester.run_load_test(
        "GET",
        "/",
        concurrent_requests=20,
        total_requests=100
    )
    
    # Test 3: Login Endpoint (moderate load)
    await tester.run_load_test(
        "POST",
        "/api/v1/auth/login",
        concurrent_requests=10,
        total_requests=50,
        json={
            "email": "test@example.com",
            "password": "TestPassword123!"
        }
    )
    
    # Test 4: Get Current User (requires auth, will fail but tests endpoint)
    await tester.run_load_test(
        "GET",
        "/api/v1/auth/me",
        concurrent_requests=10,
        total_requests=50
    )
    
    # Print summary
    tester.print_summary()
    
    # Performance targets validation
    print("\n" + "="*60)
    print("🎯 PERFORMANCE TARGETS VALIDATION")
    print("="*60)
    
    targets = {
        "Health Check": 50,  # < 50ms
        "Root Endpoint": 50,  # < 50ms
        "Login": 500,  # < 500ms
        "Get Current User": 300,  # < 300ms
    }
    
    for result in tester.results:
        endpoint = result["endpoint"]
        mean_response = result["response_time_ms"]["mean"]
        p95_response = result["response_time_ms"]["p95"]
        
        # Determine target
        if "health" in endpoint.lower():
            target = targets["Health Check"]
        elif "/" == endpoint.split()[1]:
            target = targets["Root Endpoint"]
        elif "login" in endpoint.lower():
            target = targets["Login"]
        elif "me" in endpoint.lower():
            target = targets["Get Current User"]
        else:
            target = 1000  # Default target
        
        mean_status = "✅ PASS" if mean_response < target else "❌ FAIL"
        p95_status = "✅ PASS" if p95_response < target else "❌ FAIL"
        
        print(f"\n{endpoint}:")
        print(f"  Target: < {target}ms")
        print(f"  Mean: {mean_response:.2f}ms - {mean_status}")
        print(f"  P95: {p95_response:.2f}ms - {p95_status}")


async def run_stress_test():
    """Run stress test with high concurrency"""
    tester = LoadTester()
    
    print("\n" + "="*60)
    print("🔥 AROHAN API STRESS TEST")
    print("="*60)
    
    # Stress test health endpoint
    await tester.run_load_test(
        "GET",
        "/health",
        concurrent_requests=50,
        total_requests=500
    )
    
    tester.print_summary()


async def run_sustained_load_test():
    """Run sustained load test over time"""
    tester = LoadTester()
    
    print("\n" + "="*60)
    print("⏱️  AROHAN API SUSTAINED LOAD TEST")
    print("="*60)
    
    # Run multiple batches over time
    for i in range(5):
        print(f"\n📊 Batch {i+1}/5:")
        await tester.run_load_test(
            "GET",
            "/health",
            concurrent_requests=20,
            total_requests=100
        )
        
        # Wait between batches
        if i < 4:
            print("⏳ Waiting 5 seconds before next batch...")
            await asyncio.sleep(5)
    
    tester.print_summary()


if __name__ == "__main__":
    import sys
    
    # Parse command line arguments
    test_type = sys.argv[1] if len(sys.argv) > 1 else "performance"
    
    if test_type == "performance":
        asyncio.run(run_performance_tests())
    elif test_type == "stress":
        asyncio.run(run_stress_test())
    elif test_type == "sustained":
        asyncio.run(run_sustained_load_test())
    else:
        print(f"Unknown test type: {test_type}")
        print("Available test types: performance, stress, sustained")
        sys.exit(1)