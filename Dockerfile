# -------------------------
# Stage 0: Build React
# -------------------------
FROM node:18 AS nodebuild
WORKDIR /client

# Copy package files and install (speeds up rebuilds)
COPY system-frontend/package*.json ./
RUN npm install

# Copy the rest of the frontend and build
COPY system-frontend/ ./
RUN npm run build

# -------------------------
# Stage 1: Build .NET app
# -------------------------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the csproj and restore as a separate step for caching
COPY *.csproj ./
RUN dotnet restore

# Copy everything (including src and the system-frontend folder)
COPY . ./

# Copy the React build output into ASP.NET's wwwroot before publish
# (React build produced at /client/build inside nodebuild)
RUN rm -rf ./wwwroot || true
COPY --from=nodebuild /client/build ./wwwroot

# Publish the app
RUN dotnet publish EventBookingSystem.csproj -c Release -o /app/out

# -------------------------
# Stage 2: Runtime image
# -------------------------
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out ./

# Port (ASP.NET listens to PORT env or default 80/443)
EXPOSE 80

ENTRYPOINT ["dotnet", "EventBookingSystem.dll"]
