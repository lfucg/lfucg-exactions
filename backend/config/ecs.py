import environ
import requests


def get_task_ips():
    """
    Retrieve the internal ip address(es) for task, if running with AWS ECS and awsvpc
    networking mode used to get ips to add to ALLOWED_HOSTS setting, for load balancer
    health checks. See
    https://docs.aws.amazon.com/AmazonECS/latest/userguide/task-metadata-endpoint-v4-fargate.html
    """
    env = environ.Env()

    endpoint = env("ECS_CONTAINER_METADATA_URI_V4", default="")
    if not endpoint:
        return []

    addresses = []
    try:
        r = requests.get(f"{endpoint}/task", timeout=0.01)
    except requests.exceptions.RequestException as e:
        print("Failed to retrieve ECS private IPs")
        print(str(e))

        return []

    if r.ok:
        task_metadata = r.json()
        for container in task_metadata["Containers"]:
            for network in container["Networks"]:
                if network["NetworkMode"] == "awsvpc":
                    addresses.extend(network["IPv4Addresses"])

    return list(set(addresses))
