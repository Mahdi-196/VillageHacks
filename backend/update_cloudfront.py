import json

with open('/tmp/cloudfront-config.json', 'r') as f:
    config = json.load(f)

etag = config['ETag']
dist_config = config['DistributionConfig']

lambda_origin = {
    "Id": "medesense-backend-lambda",
    "DomainName": "jfhvwb22dym2eptdztqdwsdlce0wejws.lambda-url.us-east-1.on.aws",
    "OriginPath": "",
    "CustomHeaders": {"Quantity": 0},
    "CustomOriginConfig": {
        "HTTPPort": 80,
        "HTTPSPort": 443,
        "OriginProtocolPolicy": "https-only",
        "OriginSslProtocols": {
            "Quantity": 1,
            "Items": ["TLSv1.2"]
        },
        "OriginReadTimeout": 30,
        "OriginKeepaliveTimeout": 5
    },
    "ConnectionAttempts": 3,
    "ConnectionTimeout": 10,
    "OriginShield": {"Enabled": False}
}

dist_config['Origins']['Items'].append(lambda_origin)
dist_config['Origins']['Quantity'] = len(dist_config['Origins']['Items'])

api_cache_behavior = {
    "PathPattern": "/api/*",
    "TargetOriginId": "medesense-backend-lambda",
    "TrustedSigners": {"Enabled": False, "Quantity": 0},
    "TrustedKeyGroups": {"Enabled": False, "Quantity": 0},
    "ViewerProtocolPolicy": "https-only",
    "AllowedMethods": {
        "Quantity": 7,
        "Items": ["HEAD", "DELETE", "POST", "GET", "OPTIONS", "PUT", "PATCH"],
        "CachedMethods": {
            "Quantity": 2,
            "Items": ["HEAD", "GET"]
        }
    },
    "SmoothStreaming": False,
    "Compress": True,
    "LambdaFunctionAssociations": {"Quantity": 0},
    "FunctionAssociations": {"Quantity": 0},
    "FieldLevelEncryptionId": "",
    "CachePolicyId": "4135ea2d-6df8-44a3-9df3-4b5a84be39ad",
    "OriginRequestPolicyId": "216adef6-5c7f-47e4-b989-5492eafa07d3",
    "GrpcConfig": {"Enabled": False}
}

if 'Items' not in dist_config['CacheBehaviors']:
    dist_config['CacheBehaviors']['Items'] = []

dist_config['CacheBehaviors']['Items'].append(api_cache_behavior)
dist_config['CacheBehaviors']['Quantity'] = len(dist_config['CacheBehaviors']['Items'])

with open('/tmp/cloudfront-config-updated.json', 'w') as f:
    json.dump(dist_config, f, indent=2)

print(f"ETag: {etag}")
print(f"Origins: {dist_config['Origins']['Quantity']}")
print(f"Cache Behaviors: {dist_config['CacheBehaviors']['Quantity']}")
