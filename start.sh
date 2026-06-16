#!/bin/bash

# 启动脚本 - 检查并启动 MySQL、Redis，然后启动后端服务

set -e

REDIS_HOST="127.0.0.1"
REDIS_PORT="6379"
MYSQL_HOST="127.0.0.1"
MYSQL_PORT="3306"
MYSQL_USER="root"
MYSQL_PASS="183416xyz"
MYSQL_SOCKET="/var/run/mysqld/mysqld.sock"

echo "========================================"
echo "         启动后端服务脚本"
echo "========================================"

# 检查并启动 Redis
echo ""
echo "[1/3] 检查 Redis 服务..."
if redis-cli -h $REDIS_HOST -p $REDIS_PORT ping > /dev/null 2>&1; then
    echo "Redis 已运行"
else
    echo "Redis 未运行，正在启动..."
    redis-server --daemonize yes
    sleep 2
    
    # 等待 Redis 启动
    RETRY=0
    MAX_RETRY=10
    while ! redis-cli -h $REDIS_HOST -p $REDIS_PORT ping > /dev/null 2>&1; do
        RETRY=$((RETRY + 1))
        if [ $RETRY -ge $MAX_RETRY ]; then
            echo "ERROR: Redis 启动超时"
            exit 1
        fi
        echo "等待 Redis 启动... ($RETRY/$MAX_RETRY)"
        sleep 1
    done
    echo "Redis 启动成功"
fi

# 检查并启动 MySQL
echo ""
echo "[2/3] 检查 MySQL 服务..."
if mysql -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASS --socket=$MYSQL_SOCKET -e "SELECT 1" > /dev/null 2>&1; then
    echo "MySQL 已运行"
else
    echo "MySQL 未运行，正在启动..."
    
    # 尝试使用 systemctl 启动
    if systemctl start mysql > /dev/null 2>&1; then
        echo "使用 systemctl 启动 MySQL 成功"
    else
        # 尝试使用 service 命令
        if service mysql start > /dev/null 2>&1; then
            echo "使用 service 命令启动 MySQL 成功"
        else
            echo "WARNING: 无法自动启动 MySQL，请手动启动后再运行此脚本"
        fi
    fi
    
    # 等待 MySQL 启动
    RETRY=0
    MAX_RETRY=30
    while ! mysql -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASS --socket=$MYSQL_SOCKET -e "SELECT 1" > /dev/null 2>&1; do
        RETRY=$((RETRY + 1))
        if [ $RETRY -ge $MAX_RETRY ]; then
            echo "ERROR: MySQL 启动超时"
            exit 1
        fi
        echo "等待 MySQL 启动... ($RETRY/$MAX_RETRY)"
        sleep 2
    done
    echo "MySQL 启动成功"
fi

# 确保数据库存在
echo ""
echo "[3/3] 检查并创建数据库..."
mysql -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASS --socket=$MYSQL_SOCKET -e "CREATE DATABASE IF NOT EXISTS aigc_friendly_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
echo "数据库检查完成"

echo ""
echo "========================================"
echo "       所有依赖服务已就绪"
echo "========================================"

# 启动后端服务
echo ""
echo "启动后端 API 服务..."
cd /tmp/aigc-friendly-backend
npm run dev:api