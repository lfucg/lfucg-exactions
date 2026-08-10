# How to execute shell commands on ECS instances

To use `manage.py` you need a shell, and this is an ECS cluster, so
you need to get a shell on an instance, and this is more complicated
than just ssh to a host.

## Command

```sh
aws ecs execute-command \
    --cluster <cluster> \
    --task <task> \
    --interactive \
    --command "/bin/bash"
```

In one version of this command, it included another option:

```sh
    --container default \
```

This option doesn't work, but could be necessary in another context.

## Steps

0. Configure your AWS credentials for AWS CLI (not described here)
1. Log in to console.aws.amazon.com
2. Navigate to: Amazon Elastic Container Service -> Clusters
3. Navigate to cluster: dev-exactions or prod-exactions
4. Copy execute command and replace <cluster> with name of your chosen cluster
5. Click Tasks tab, click first first link on first task to get task details
6. On Task Overview copy Task ARN
7. Paste copied ARN into command in place of <task>
8. Run `mfaws [profile name]` for the profile you previously configured
9. Run command in same terminal
10. Run `source ./scripts/entrypoint.sh` to get ENV set up.
11. Run `./manage.py [command]`
12. Profit!
