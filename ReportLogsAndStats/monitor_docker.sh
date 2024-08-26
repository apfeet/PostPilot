#!/bin/bash

# Colors and emojis
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'


# Check if required variables are set
if [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ] || [ -z "$MONGODB_HOST" ] || [ -z "$MODALITY" ]; then
    echo -e "${RED}Error: Required environment variables are not set in .env file${NC}"
    exit 1
fi

# Function to print development mode message
print_dev_mode_message() {
    echo -e "${MAGENTA}
🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀
🔧 DEVELOPMENT MODE ACTIVATED! 🔧
🛠️  You are currently in development mode! 🛠️
💻 Happy coding and testing! 💻
🐛 Don't forget to squash those bugs! 🐛
🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀
${NC}"
}

# Set memory threshold to 5GB
MEM_THRESHOLD=5000

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo -e "${RED}Error: jq is not installed. Please install it and try again.${NC}"
    exit 1
fi

# Log directory
LOG_DIR="./logs"
MAX_LOG_FILES=500

# MongoDB connection string
MONGO_URI="mongodb://$DB_USER:$DB_PASSWORD@$MONGODB_HOST:27017/"

# Function to format uptime
format_uptime() {
    local total_seconds=$1
    local days=$((total_seconds/86400))
    local hours=$(( (total_seconds%86400)/3600 ))
    local minutes=$(( (total_seconds%3600)/60 ))
    local seconds=$((total_seconds%60))
    printf "%d days, %02d:%02d:%02d" $days $hours $minutes $seconds
}

# Function to manage log rotation
manage_logs() {
    local num_files=$(ls -1q "$LOG_DIR"/*.txt | wc -l)
    if (( num_files > MAX_LOG_FILES )); then
        local oldest_file=$(ls -t "$LOG_DIR"/*.txt | tail -1)
        > "$oldest_file"  # Empty the oldest file
    fi
}

# Function to clear MongoDB cache
clear_cache() {
    echo -e "${YELLOW}🧹 Clearing cache...${NC}"
    mongosh "$MONGO_URI" --quiet --eval "db.runCommand({ closeAllDatabases: 1 })"
    echo -e "${GREEN}✅ Cache cleared successfully.${NC}"
}

# Function to generate the report
generate_report() {
    # Log file name based on current timestamp
    local log_file="$LOG_DIR/log_$(date '+%Y%m%d_%H%M%S').txt"

    # Redirect output to both console and log file
    {
        echo -e "${YELLOW}🕒 ${CYAN}Report generated on $(date)${NC}\n"

        # Get server statistics
        local stats=$(mongosh "$MONGO_URI" --quiet --eval "JSON.stringify(db.serverStatus())")

        # Uptime Section
        local uptime=$(echo $stats | jq '.uptime')
        local formatted_uptime=$(format_uptime $uptime)
        echo -e "${BLUE}⏱️  ${GREEN}Uptime:${NC} $formatted_uptime\n"

        # Connections Section
        local current_conns=$(echo $stats | jq '.connections.current')
        local available_conns=$(echo $stats | jq '.connections.available')
        echo -e "${BLUE}🔌 ${GREEN}Connections:${NC}"
        echo -e "   ➡️  Active: ${YELLOW}$current_conns${NC}"
        echo -e "   🟢 Available: ${YELLOW}$available_conns${NC}\n"

        # Operations Section
        local insert_ops=$(echo $stats | jq '.opcounters.insert')
        local query_ops=$(echo $stats | jq '.opcounters.query')
        local update_ops=$(echo $stats | jq '.opcounters.update')
        local delete_ops=$(echo $stats | jq '.opcounters.delete')
        echo -e "${BLUE}🔢 ${GREEN}Total Operations:${NC}"
        echo -e "   📥 Inserts: ${YELLOW}$insert_ops${NC}"
        echo -e "   🔍 Queries: ${YELLOW}$query_ops${NC}"
        echo -e "   🔄 Updates: ${YELLOW}$update_ops${NC}"
        echo -e "   🗑️  Deletions: ${YELLOW}$delete_ops${NC}\n"

        # Memory Usage Section
        local mem_resident=$(echo $stats | jq '.mem.resident')
        local mem_virtual=$(echo $stats | jq '.mem.virtual')
        echo -e "${BLUE}🧠 ${GREEN}Memory Usage:${NC}"
        echo -e "   💾 Resident: ${YELLOW}$mem_resident MB${NC}"
        echo -e "   💽 Virtual: ${YELLOW}$mem_virtual MB${NC}\n"

        # Check resident memory threshold and clear cache if necessary
        if (( $(echo "$mem_resident > $MEM_THRESHOLD" | bc -l) )); then
            clear_cache
            echo -e "${RED}🚨 Resident memory exceeds threshold! Cache cleared.${NC}\n"
        else
            echo -e "${GREEN}✅ Resident memory below threshold.${NC}\n"
        fi

        # Database Statistics Section
        local db_stats=$(mongosh "$MONGO_URI" --quiet --eval "JSON.stringify(db.stats())")
        local collections=$(echo $db_stats | jq '.collections')
        local objects=$(echo $db_stats | jq '.objects')
        local avg_obj_size=$(echo $db_stats | jq '.avgObjSize')
        local data_size=$(echo $db_stats | jq '.dataSize')
        echo -e "${BLUE}📊 ${GREEN}Database Statistics:${NC}"
        echo -e "   📚 Collections: ${YELLOW}$collections${NC}"
        echo -e "   🏷️  Total Objects: ${YELLOW}$objects${NC}"
        echo -e "   📏 Average Object Size: ${YELLOW}$avg_obj_size bytes${NC}"
        echo -e "   💾 Total Data Size: ${YELLOW}$data_size bytes${NC}\n"

        echo -e "${GREEN}🌈 Report completed! ${CYAN}Next report in 10 minutes...${NC}\n"
    } | tee -a "$log_file"

    manage_logs  # Check and manage log rotation
}

# Create log directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Main loop
while true; do
    if [ "$MODALITY" != "prod" ]; then
        print_dev_mode_message
    else
        generate_report
    fi
    sleep 600 # Wait for 10 minutes
done